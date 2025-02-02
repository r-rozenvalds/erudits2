<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Requests\PlayerRequest;
use Illuminate\Support\Facades\Validator;
use App\Events\PlayerEvent;

class PlayerController extends Controller
{

    public function createPlayer(PlayerRequest $request)
    {
        if(Player::where('player_name', '=', $request->player_name)->where('instance_id', '=', $request->instance_id)->exists()) {
            return response()->json(['error' => 'Player already exists.'], 400);
        }
        $validated = $request->validated();

        $player = Player::create([
            'id' => Str::uuid()->toString(),
            'player_name' => $validated['player_name'],
            'instance_id' => $validated['instance_id'],
        ]);

        broadcast(new PlayerEvent('ready'));

        return response()->json(['message' => 'Player created successfully.', 'id' => $player['id']], 201);
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
        $player = Player::where('id', $request->player_id)->first();
        if($player) {
            $player->is_disqualified = true;
            $player->save();
            broadcast(new PlayerEvent('disqualified', $player->id));
            return response()->json(['message' => 'Player disqualified.'], 200);
        }
        return response()->json(['error' => 'Player not found.'], 404);
    }

    public function requalify(Request $request) {
        $player = Player::where('id', $request->player_id)->first();
        if($player && $player->is_disqualified) {
            $player->is_disqualified = false;
            $player->save();
            broadcast(new PlayerEvent('requalified', $player->id));
            return response()->json(['message' => 'Player requalified.'], 200);
        }
        return response()->json(['error' => 'Player not found.'], 404);
    }

    public function adjustPoints(Request $request) {
        $player = Player::where('id', $request->player_id)->first();
        if($player) {
            $player->points = $player->points + $request->amount;
            $player->save();

            return response()->json(['points' => $player->points], 200);
        }
        return response()->json(['error' => 'Player not found.'], 404);
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
            return response()->json(['player' => $player], 200);
        }
        return response()->json(['error' => 'Player not found.'], 404);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Player $player)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Player $player)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $player = Player::findOrFail($id);
        if($player) {
            $player->delete();
            return response()->json(['message' => 'Player deleted.'], 200);
        }
        return response()->json(['error' => 'Player not found.'], 404);
    }
}
