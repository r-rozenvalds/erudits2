<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
    public function create()
    {
        $question = (['id' => Str::uuid()->toString(), 'title' => 'Spēles jautājums', 'points' => 0, 'is_text_answer' => false, 'guidelines' => null, 'image_url' => null, 'round_id' => null]);
        return response()->json(['id' => $question->id], 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'string',
            'points' => 'integer|default:0',
            'is_text_answer' => 'boolean|nullabe|default:false',
            'guidelines' => 'string|nullable',
            'image_url' => 'string|nullable',
            'round_id' => 'required|exists:rounds,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validation->errors(), 400);
        }

        $validated = $validator->validated();

        $question = Question::findOrFail($request->id);

        if ($question) {
            $question->update($validated);
            return response()->json(['message' => ['Question successfully created.'], 'id' => $question->id], 200);
        }

        return response()->json(['message' => ['Question not found.']], 404);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $question = Question::findOrFail($id);

        if($question !== null) {
            return response()->json($question, 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $question = Question::findOrFail($id);

        if ($question->user_id !== $request->user()->id) {
            return response()->json(['message' => ['You are not authorized to perform this action.']], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string',
            'points' => 'integer|default:0',
            'is_text_answer' => 'boolean|nullabe|default:false',
            'guidelines' => 'string|nullable',
            'image_url' => 'string|nullable',
            'round_id' => 'required|exists:rounds,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        $question->update($validated);
        
        return response()->json(['message' => ["Question successfully saved."], 'id' => $question->id], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $question = Question::findOrFail($id);
        $question->delete();
        return response()->json(204);
    }
}
