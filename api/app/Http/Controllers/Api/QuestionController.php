<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Round;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $question_group = $request->question_group()->id;
        $questions = Question::where('question_group_id', $question_group)->get();
        return response()->json($questions);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(string $roundId)
    {
        if(!$roundId) {
            return response()->json(['message' => 'Round ID is required.'], 400);
        }


        $question = [
            'id' => Str::uuid()->toString(), 
            'title' => 'Spēles jautājums', 
            'is_text_answer' => false, 
            'guidelines' => null, 
            'image_url' => null, 
            'round_id' => $roundId
        ];

        return response()->json(['message' => 'Question is ready for creation.', 'question' => $question], 201);
        }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validated();

        $question = Question::create($validated);
    
        return response()->json(['message' => 'Question successfully created.', 'question' => $question], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $question = Question::findOrFail($id);

        return response()->json($question, 200);
        
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $question = Question::findOrFail($id);

        $round = Round::findOrFail($question->round_id);

        $this->authorize('manage', Game::findOrFail($round->game_id));

        $validated = $request->validated();
        $question->update($validated);
        
        return response()->json(['message' => "Question successfully saved.", 'id' => $question->id], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $question = Question::findOrFail($id);

        $round = Round::findOrFail($question->round_id);

        $this->authorize('manage', Game::findOrFail($round->game_id));

        $question->delete();
        return response()->json(null, 204);
    }
}
