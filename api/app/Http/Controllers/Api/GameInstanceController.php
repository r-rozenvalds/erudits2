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
use App\Http\Resources\GameInstanceResource;
use App\Events\GameControlEvent;

class GameInstanceController extends PlayerAnswerController
{
    /**
     * Display a listing of the resource.
     */
    public function indexGameInstances()
    {
        $gameInstances = GameInstance::where('end_date', '>', now())
            ->where('private', false)
            ->get();
    
        $gameInstanceResource = $gameInstances->map(function ($gameInstance) {
            $game = Game::find($gameInstance->game_id);
            return new GameInstanceResource((object) [
                'code' => $gameInstance->code,
                'title' => $game->title,
                'description' => $game->description,
            ]);
        });
    
        return response()->json(['game_instances' => $gameInstanceResource], 200);
    }
    
    


    public function indexWithPlayerInfo(Request $request) {
        $instanceId = $request->instance_id;
        $playerId = $request->player_id;

        if(!$instanceId || !$playerId) {
            return $this->indexGameInstances();
        }

        $player = Player::where('id', $playerId)->first();

        if (!$player || $player->is_disqualified) {
            return $this->indexGameInstances();
        }
        
        $startedGame = GameInstance::where('id', $instanceId)
            ->where('end_date', '>', now())
            ->where('private', false)
            ->first();

        return response()->json(['game_instances' => $this->indexGameInstances()->getData()->game_instances, 'started_game_code' => $startedGame?->code], 200);
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

        $game = Game::find($validated['game_id']);
        $game->last_activation = now();
        $game->save();

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
    
        $round = Round::find($gameInstance->current_round);
        $question = optional(Question::find($gameInstance->current_question))->title; 
    
        $playersCount = Player::where('instance_id', $instanceId)->count();
    
        if ($round) {
            $answeredPlayers = $round->is_test 
                ? Player::where('instance_id', $instanceId)->where('round_finished', 1)->count()
                : PlayerAnswer::where('instance_id', $instanceId)
                    ->where('question_id', $gameInstance->current_question)
                    ->count();
    
            $roundQuestions = Question::where('round_id', $round->id)->get()->sortBy('order')->values();
        } else {
            $answeredPlayers = 0;
            $roundQuestions = [];
        }
    
        $playerAnswers = $this->getInstanceAnswers($instanceId)->getData();
    
        return response()->json([
            'instance_info' => [
                'players' => $playersCount,
                'current_round' => optional($round)->title,
                'answered_players' => $answeredPlayers,
                'answer_time' => optional($round)->answer_time,
                'current_question' => optional($round)->is_test ? 'TESTS' : $question,
                'round_started_at' => $gameInstance->round_started_at,
                'round_questions' => $roundQuestions,
                'is_test' => optional($round)->is_test,
            ],
            'player_answers' => $playerAnswers,
        ], 200);
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
        $round = Round::findOrFail($gameInstance->current_round);
        $questions = Question::where('round_id', $round->id)
            ->get(['id', 'title', 'is_text_answer', 'guidelines', 'image_url', 'order'])->sortBy('order')->values();
            
        return response()->json([
            'questions' => $questions,
        ], 200);
    }

    public function roundInfo(string $instanceId){
        $gameInstance = GameInstance::findOrFail($instanceId);
        $round = Round::findOrFail($gameInstance->current_round, [
            'id', 'title', 'answer_time', 'disqualify_amount', 'is_additional', 'is_test', 'order'
        ]);
        $round['round_started_at'] = $gameInstance->round_started_at;
        $round['current_question'] = $gameInstance->current_question;
        $round['total_questions'] = Question::where('round_id', $round->id)->count();

        $questions = Question::where('round_id', $round->id)
        ->get(['id', 'title', 'is_text_answer', 'guidelines', 'image_url', 'order'])->sortBy('order')->values();

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
            'answers' => $answers
        ], 200);
    }

    public function currentQuestion(string $instanceId)
    {
        $gameInstance = GameInstance::findOrFail($instanceId);
        $question = Question::find($gameInstance->current_question);
        return response()->json(['question' => $question], 200);
    }

    private function clearFinishedPlayers(string $instanceId) {
        Player::where('instance_id', $instanceId)
            ->where('round_finished', 1)
            ->update(['round_finished' => 0]);
    }

    public function nextRound(Request $request) {
        $gameInstance = GameInstance::findOrFail($request->instance_id);
        $game = Game::findOrFail($gameInstance->game_id);
        $currentRound = Round::find($gameInstance->current_round);
    
        $nextRound = $game->rounds()->where('order', '>', $currentRound?->order)
            ->orderBy('order')
            ->first();
            
        if ($nextRound) {
            $gameInstance->current_round = $nextRound->id;
            $gameInstance->current_question = null;
            $gameInstance->round_started_at = null;
            if($nextRound->is_test) {
                $gameInstance->round_started_at = now();
            }
            $gameInstance->save();
    
            $this->clearFinishedPlayers($gameInstance->id);

            if($nextRound->is_test){
                broadcast(new GameControlEvent($gameInstance->id, 'next-round'));
            }
    
            return response()->json(['message' => 'Next round started.'], 200);
        }
    
        return response()->json(['message' => 'No more rounds.'], 400);
    }
    

    public function previousRound(Request $request) {
        $gameInstance = GameInstance::findOrFail($request->instance_id);
        $game = Game::findOrFail($gameInstance->game_id);
        $rounds = $game->rounds()->get();
        $currentRound = Round::find($gameInstance->current_round);
        $previousRound = $rounds->where('order', '<', $currentRound?->order)->sortByDesc('order')->first();
        if ($previousRound) {
            $gameInstance->current_round = $previousRound->id;
            $gameInstance->current_question = null;
            if($previousRound->is_test) {
                $gameInstance->round_started_at = now();
            }
            $gameInstance->save();
            
            if($previousRound->is_test){
                broadcast(new GameControlEvent($gameInstance->id, 'previous-round'));
            }
            $this->clearFinishedPlayers($gameInstance->id);

            return response()->json(['message' => 'Previous round started.'], 200);
        }
        return response()->json(['message' => 'No more rounds.'], 400);
    }

    public function nextQuestion(Request $request) {
        $gameInstance = GameInstance::findOrFail($request->instance_id);
        $round = Round::findOrFail($gameInstance->current_round);
        $questions = Question::where('round_id', $round->id)->get();
        $currentQuestion = Question::find($gameInstance->current_question);

        if(!$currentQuestion || !$round->is_test) {
            $gameInstance->round_started_at = now();
            $gameInstance->save();
        }

        $nextQuestion = $questions->where('order', '>', $currentQuestion?->order)->sortBy('order')->first();
        if ($nextQuestion) {
            $gameInstance->current_question = $nextQuestion->id;
            $gameInstance->save();
            broadcast(new GameControlEvent($gameInstance->id, 'next-question'));

            $this->clearFinishedPlayers($gameInstance->id);

            return response()->json(['message' => 'Next question started.'], 200);
        }
        return response()->json(['message' => 'No more questions.'], 400);
    }

    public function previousQuestion (Request $request) {
        $gameInstance = GameInstance::findOrFail($request->instance_id);
        $round = Round::findOrFail($gameInstance->current_round);
        $questions = Question::where('round_id', $round->id)->get();
        $currentQuestion = Question::find($gameInstance->current_question);
        $previousQuestion = $questions->where('order', '<', $currentQuestion?->order)->sortByDesc('order')->first();
        if ($previousQuestion) {
            $gameInstance->current_question = $previousQuestion->id;
            $gameInstance->save();
            broadcast(new GameControlEvent($gameInstance->id, 'previous-question'));

            $this->clearFinishedPlayers($gameInstance->id);

            return response()->json(['message' => 'Previous question started.'], 200);
        }
        return response()->json(['message' => 'No more questions.'], 400);
    }
    
    public function gameControl(Request $request) {
        $command = $request->input('command');
        $instanceId = $request->input('instance_id'); 
        if($command == 'start') {
            $gameId = GameInstance::where('id', $instanceId)->value('game_id');
            $roundId = Round::where('game_id', $gameId)->where('order', 1)->value('id');

            GameInstance::where('id', $instanceId)->update(['current_round' => $roundId, 'round_started_at' => now()]);
        } else {
            GameInstance::where('id', $instanceId)->update(['end_date' => now(), 'round_started_at' => null]);
        } 

        broadcast(new GameControlEvent($instanceId, $command));

        return response()->json(['status' => 'Command broadcasted']);
    }
    
}
