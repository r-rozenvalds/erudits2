<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameInstance;
use App\Models\Game;
use App\Models\Round;
use App\Models\Question;
use App\Models\PlayerAnswer;
use App\Models\Player;
use App\Models\Answer;
use App\Http\Controllers\Api\GameController;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Requests\GameInstanceRequest;
use Illuminate\Support\Facades\Validator;


class GameInstanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function activate(GameInstanceRequest $request)
    {
        $validated = $request->validated();

        if (
            GameInstance::where('game_id', $validated['game_id'])->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>', now());
            })->exists()
        ) {
            return response()->json(['message' => 'Game instance already active.'], 400);
        }

        if (GameInstance::where('code', '=', $validated['code'])->where('end_date', '>', now())->exists()) {
            return response()->json(['message' => 'Code already in use.'], 400);
        }

        $gameInstance = [
            'id' => Str::uuid()->toString(),
            'game_id' => $validated['game_id'],
            'code' => $validated['code'],
            'private' => $validated['private'],
            'end_date' => $validated['end_date'],
        ];
        GameInstance::create($gameInstance);

        return response()->json(['message' => 'Game instance successfully created.', 'id' => $gameInstance['id']], 201);
    }

    public function status(string $gameId)
    {
        $gameInstance = GameInstance::where('gameId', $gameId)->first();
        if ($gameInstance) {
            return response()->json(['status' => $gameInstance->is_active], 200);
        } else {
            return response()->json(['message' => 'Game instance not found.'], 404);
        }
    }

    public function join(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|min:3',
            'playerId' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid code.'], 400);
        }

        $gameInstance = GameInstance::where('code', $request->code)
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>', now());
            })->first();
        if ($gameInstance && $gameInstance->current_round !== null) { // if game already started
            $player = Player::find($request->playerId);
            if (!$player) { // and player not found
                return response()->json(['error' => 'Game already started'], 400);
            }
            if ($player->disqualified) { // if found but disqualified
                return response()->json(['error' => 'Player disqualified'], 400);
            }
        }
        if ($gameInstance) {
            $game = Game::where('id', $gameInstance->game_id)->first();
            return response()->json(['message' => 'Game instance found.', 'id' => $gameInstance['id'], 'end_date' => $gameInstance['end_date'], 'title' => $game['title']], 200);
        } else {
            return response()->json(['error' => 'Game instance not found.'], 404);
        }
    }

    public function questionInfo(string $instanceId)
    {
        $gameInstance = GameInstance::findOrFail($instanceId);

        if ($gameInstance) {
            $round = Round::find($gameInstance->current_round);
            $question = Question::find($gameInstance->current_question)?->title;
            $answeredPlayers = PlayerAnswer::where('instance_id', $instanceId)->where('question_id', $gameInstance->current_question)->count() ?? 0;
            $playersCount = Player::where('instance_id', $instanceId)->count() ?? 0;
            $roundQuestions = Question::where('round_id', $round?->id)->get() ?? [];

            return response()->json([
                'players' => $playersCount,
                'current_round' => $round?->title ?? 'N/A',
                'answered_players' => $answeredPlayers,
                'answer_time' => $round?->answer_time ?? 'N/A',
                'current_question' => $question ?? 'N/A',
                'started' => $gameInstance->started,
                'round_questions' => $roundQuestions
            ], 200);
        }

        return response()->json(['message' => 'Game instance not found.'], 404);
    }



    public function instanceGame(Request $request, string $id)
    {
        $gameInstance = GameInstance::findOrFail($id);
        $game = Game::where('id', $gameInstance->game_id)->first();
        $gameController = new GameController();
        $fullIndex = $gameController->fullIndex($request, $game->id);
        return response()->json(['game' => $fullIndex->original, 'instance' => $gameInstance], 200);
    }

    public function roundQuestions(string $instanceId)
{
    $gameInstance = GameInstance::findOrFail($instanceId);
    $round = Round::findOrFail($gameInstance->current_round, [
        'id', 'title', 'answer_time', 'disqualify_amount', 'is_additional', 'is_test', 'order'
    ]);
    
    $questions = Question::where('round_id', $round->id)
        ->get(['id', 'title', 'is_text_answer', 'guidelines', 'image_url', 'order']);

    $questionsWithTextAnswers = $questions->where('is_text_answer', true)->pluck('id')->toArray();

    $answers = Answer::whereIn('question_id', $questions->pluck('id'))
        ->get(['id', 'text', 'question_id'])
        ->map(function ($answer) use ($questionsWithTextAnswers) {
            if (in_array($answer->question_id, $questionsWithTextAnswers)) {
                $answer->text = null;
            }
            return $answer;
        });
        
        
    return response()->json([
        'round' => $round,
        'questions' => $questions,
        'answers' => $answers
    ], 200);
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
    public function show(GameInstance $gameInstance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GameInstance $gameInstance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GameInstance $gameInstance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GameInstance $gameInstance)
    {
        //
    }
}
