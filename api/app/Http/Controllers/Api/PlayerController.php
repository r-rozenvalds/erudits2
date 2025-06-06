<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Requests\PlayerRequest;
use Illuminate\Support\Facades\Validator;
use App\Events\PlayerEvent;
use App\Models\GameInstance;
use App\Http\Resources\PlayerResource;
use App\Events\RefreshPlayersEvent;
use Illuminate\Support\Facades\Log;
use Exception;

use App\Http\Requests\QueryModels\PlayerQueryModel; 
use App\Traits\QueryTraits;

class PlayerController extends Controller
{

    use QueryTraits;

    public function createPlayer(PlayerRequest $request)
    {
        Log::info('Creating player ' . $request->player_name . ' for instance ' . $request->instance_id);
        try{
            if(Player::where('player_name', '=', $request->player_name)->where('instance_id', '=', $request->instance_id)->exists()) {
                return response()->json(['message' => 'Player already exists.'], 400);
            }
            $validated = $request->validated();

            $player = Player::create([
                'id' => Str::uuid()->toString(),
                'player_name' => $validated['player_name'],
                'instance_id' => $validated['instance_id'],
            ]);

            broadcast(new RefreshPlayersEvent($request->instance_id, $player));

            return response()->json(['message' => 'Player created successfully.', 'id' => $player['id']], 201);
        }
        catch(Exception $e) {
            Log::error('Error while creating player ' . $request->player_name . ' for instance ' . $request->instance_id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Error while creating player.'], 500);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, string $instanceId)
    {
        $players = Player::where('instance_id', $instanceId)->get();
        return response()->json(['players' => $players], 200);
    }

    public function disqualify(Request $request) {
        $players = explode(',', $request->player_ids);

        Log::info('Disqualifying players ' . $request->player_ids);
        foreach ($players as $playerId) {
            try {
                $player = Player::where('id', $playerId)->first();
                if($player && !$player->is_disqualified) {
                    $player->is_disqualified = true;
                    $player->save();
                    event(new PlayerEvent($playerId, 'disqualified'));
                }
            } catch(Exception $e) {
                Log::error('Error while disqualifying player ' . $playerId . ': ' . $e->getMessage());
            }
        }
        return response()->json(['message' => 'Players disqualified.'], 200);
    }

    public function requalify(Request $request) {
        $players = explode(',', $request->player_ids);

        Log::info('Requalifying players ' . $request->player_ids);
        foreach ($players as $playerId) {
            try {
                $player = Player::where('id', $playerId)->first();
                if($player && $player->is_disqualified) {
                    $player->is_disqualified = false;
                    $player->save();
                    event(new PlayerEvent($playerId, 'requalified'));
                }
            } catch(Exception $e) {
                Log::error('Error while requalifying player ' . $playerId . ': ' . $e->getMessage());
            }
        }
        return response()->json(['message' => 'Players requalified.'], 200);
    }

    public function adjustPoints(Request $request) {
        $player = Player::where('id', $request->player_id)->first();
        if($player) {
            $player->points = $request->points;
            $player->save();

            return response()->json(['message' => 'Points adjusted successfully.'], 200);
        }
        return response()->json(['message' => 'Player not found.'], 404);
    }

    public function finishRound(Request $request) {
        $player = Player::find($request->player_id);
        if($player) {
            $player->round_finished = true;
            $player->save();
            return response()->json(['message' => 'Player round finished.'], 200);
        }
        return response()->json(['message' => 'Player not found.'], 404);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $player = Player::findOrFail($id);
        if($player) {
            $instance = GameInstance::where('id', $player->instance_id)->first(['started_at', 'game_started', 'buzzers_mode']);
            return response()->json(['player' => new PlayerResource($player), 'instance' => $instance], 200);
        }
        return response()->json(['message' => 'Player not found.'], 404);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $playerIds = explode(',', $request->player_ids);
        Log::info('Deleting players ' . $request->player_ids);
        foreach ($playerIds as $id) {
            try {
                $player = Player::where('id', $id)->first();
                if($player) {
                    $player->delete();
                }
            } catch(Exception $e) {
                Log::error('Error while deleting player ' . $id . ': ' . $e->getMessage());
            }
        }
        return response()->json(['message' => 'Players deleted.'], 200);
    }

//----------------------------------- new apis

    public function get(PlayerQueryModel $request) {
        $filterableFields = ['player_name'];

        $query = Player::query();

        $paginator = $this->applyQueryParameters($query, $request, $filterableFields);

        $players = $paginator->items();

        // Filter out disqualified players for ranking
        $rankedPlayers = collect($players)->filter(function ($player) {
            return !$player->is_disqualified;
        })->sortByDesc('points')->values();

        // Assign ranks to players
        $rankedPlayers->each(function ($player, $index) {
            $player->position = $index + 1;
        });

        // Add position '-' for disqualified players
        foreach ($players as $player) {
            if ($player->is_disqualified) {
            $player->position = '-';
            } else {
            $player->position = $rankedPlayers->firstWhere('id', $player->id)->position ?? '-';
            }
        }

        // Sort players by position
        usort($players, function ($a, $b) {
            if ($a->position === '-' && $b->position === '-') {
            return 0;
            }
            if ($a->position === '-') {
            return 1;
            }
            if ($b->position === '-') {
            return -1;
            }
            return $a->position <=> $b->position;
        });

        return response()->json([
            'items' => $players,
            'total_items' => $paginator->total(),
            'items_per_page' => $paginator->perPage(),
            'page' => $paginator->currentPage(),
            'total_pages' => $paginator->lastPage(),
        ]);
    }
}
