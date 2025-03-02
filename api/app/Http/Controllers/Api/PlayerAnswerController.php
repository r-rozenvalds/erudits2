<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PlayerAnswer;
use Illuminate\Http\Request;
use App\Http\Requests\PlayerAnswerRequest; 
use Illuminate\Support\Str;
use App\Models\Player;
use App\Models\Answer;
use App\Events\PlayerEvent;
use App\Models\Round;


class PlayerAnswerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $gameInstanceId)
    {
        return PlayerAnswer::where('instance_id', $gameInstanceId)->get();
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
    public function store(PlayerAnswerRequest $request)
    {
        $validated = $request->validated();

        $player = Player::find($validated['player_id']);

        $round = Round::find($request->round_id);

        $instanceId = $player->instance_id;

        $isAnswerCorrect = false;

        if (!Str::isUuid($validated['answer'])) {
            // Normalize the user input answer
            $normalizedAnswer = strtolower(preg_replace('/[^\w\s]/', '', preg_replace('/\s+/', ' ', trim($validated['answer']))));
            
            // Fetch valid answers and normalize them
            $validAnswers = Answer::where('question_id', $validated['question_id'])->get()->pluck('text')->toArray();
            $normalizedValidAnswers = array_map(function ($answer) {
                return strtolower(preg_replace('/[^\w\s]/', '', preg_replace('/\s+/', ' ', trim($answer))));
            }, $validAnswers);
        
            // Check if the normalized user answer exists in the valid answers
            if (in_array($normalizedAnswer, $normalizedValidAnswers)) {
                $isAnswerCorrect = true;
            } else {
                $isAnswerCorrect = false;
            }
        }
        if(Str::isUuid($validated['answer'])) {
            $answer = Answer::find($validated['answer']);
            $isAnswerCorrect = $answer->is_correct;
        }

        if ($isAnswerCorrect) {
            $pointsForCorrectAnswer = $round->points;
            $player->points += $pointsForCorrectAnswer;
            $player->save();
        }

        $existingPlayerAnswer = PlayerAnswer::where('player_id', $validated['player_id'])
            ->where('question_id', $validated['question_id'])
            ->where('instance_id', $instanceId)
            ->first();

        if ($existingPlayerAnswer) {
            $existingPlayerAnswer->delete();
        }

        $playerAnswer = [
            'id' => Str::uuid()->toString(),
            'player_id' => $validated['player_id'],
            'question_id' => $validated['question_id'],
            'instance_id' => $instanceId,
            'answer_id' => Str::isUuid($validated['answer']) ? $validated['answer'] : null,
            'answer_text' => Str::isUuid($validated['answer']) ? null : $validated['answer'],
            'is_answer_correct' => $isAnswerCorrect,
        ];
        PlayerAnswer::create($playerAnswer);

        if(!$round->is_test) {
            $player->round_finished = true;
            $player->save();
        }

        return response()->json(200);
    }

    public function getInstanceAnswers(string $gameInstanceId)
{   
    $instancePlayers = Player::where('instance_id', $gameInstanceId)->get();
    $answers = PlayerAnswer::with(['player', 'question'])
        ->where('instance_id', $gameInstanceId)
        ->get()
        ->groupBy('player_id');

    $results = [];

    foreach ($instancePlayers as $player) {
        $playerId = $player->id;
        $playerAnswers = $answers[$playerId] ?? [];
        $questions = [];

        foreach ($playerAnswers as $answer) {
            $answerModel = Answer::find($answer->answer_id);

            $questions[] = [
                'id' => $answer->question->id,
                'title' => $answer->question->title,
                'answer' => $answerModel?->text ?? $answer->answer_text,
                'is_correct' => $answerModel?->is_correct ?? $answer->is_answer_correct,
            ];
        }


        $results[] = [
            'player_name' => $player->player_name ?? 'Unknown Player',
            'questions' => $questions,
            'round_finished' => $player->round_finished,
        ];
    }

    return response()->json($results);
}


    /**
     * Display the specified resource.
     */
    public function show(PlayerAnswer $playerAnswer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PlayerAnswer $playerAnswer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PlayerAnswerRequest $request)
    {
        $playerAnswer = PlayerAnswer::where('question_id', $request->question_id)->where('player_id', $request->player_id);

        if($playerAnswer->exists()) {
            $playerAnswer->update($request->all());
            return response()->json(['message' => 'Player answer successfully updated.'], 200);
        } else {
            return response()->json(['error' => 'Player answer not found.'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PlayerAnswer $playerAnswer)
    {
        //
    }
}
