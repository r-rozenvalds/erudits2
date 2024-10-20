<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Round;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class RoundController extends Controller
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $existingRound = Round::where('game_id', $request->game_id)->first();

        if ($existingRound) {
            return response()->json(['existingId' => $existingRound->id], 201);
        }

        $round = Round::create(['title' => 'Spēles kārta', 'disqualify_amount' => 0, 'answer_time' => 0, 'points' => 0, 'is_additional' => false, 'game_id' => $request->game_id]);
                
        return response()->json(['message' => ['Round successfully created.'], 'id' => $round->id], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Round $round)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Round $round)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Round $round)
    {

        $user = User::find($request->user()->id);

        $game = Game::findOrFail($round->game_id);

        if ($game->user_id !== $user->id) {
            return response()->json(['message' => ['You are not authorized to perform this action.']], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'disqualify_amount' => 'required|integer',
            'answer_time' => 'required|integer',
            'points' => 'required|integer',
            'is_additional' => 'boolean|nullable',
            'game_id' => 'required|integer',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        $validated = $validator->validated();
        
        $round->update($validated);
    
        return response()->json(['message' => ['Round successfully updated.'], 'id' => $round->id], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Round $round)
    {
        //
    }
}
