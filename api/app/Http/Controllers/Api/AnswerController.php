<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Models\Round;
use App\Models\Game;
use App\Models\Question;

class AnswerController extends Controller
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
    public function createOrUpdate(AnswerRequest $request)
    {
        $this->authorize('manage', Game::findOrFail(Question::findOrFail($request->question_id)->round()->game_id));
        $validated = $request->validated();        

        if($request->id) {
            $round = Round::findOrFail($request->id);

            $round->update($validated);
            return response()->json(['message' => 'Round successfully updated.', 'round' => $round], 200);
        };

        $roundCount = Round::where('game_id', $request->game_id)->count();
        $validated['order'] = $roundCount + 1;
        $round = Round::create($validated);

        return response()->json(['message' => 'Round successfully created.', 'round' => $round], 200);
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
    public function show(Answer $answer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Answer $answer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Answer $answer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $answerId)
    {
        $answer = Answer::findOrFail($answerId);
        $question = Question::findOrFail($answer->question_id);
        $round = Round::findOrFail($question->round_id);

        $this->authorize('manage', Game::findOrFail($round->game_id));

        $answer->delete();

        return response()->json(null, 204);
    }
}
