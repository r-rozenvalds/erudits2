<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameInstance;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Requests\GameInstanceRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

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

    public function activate(GameInstanceRequest $request) {
        $validated = $request->validated();
        
        if(GameInstance::where('game_id', $validated['game_id'])->whereNull('end_date')->exists()) {
            return response()->json(['message' => 'Game instance already active.'], 400);
        }

        $gameInstance = [
            'id' => Str::uuid()->toString(),
            'game_id' => $validated['game_id'],
            'code' => $validated['code'],
            'private' => $validated['private'],
        ];
        GameInstance::create($gameInstance);

        return response()->json(['message' => 'Game instance successfully created.', 'id' => $gameInstance['id']], 201);
    }

    public function status(string $gameId) {
        $gameInstance = GameInstance::where('gameId', $gameId)->first();
        if($gameInstance) {
            return response()->json(['status' => $gameInstance->is_active], 200);
        } else {
            return response()->json(['message' => 'Game instance not found.'], 404);
        }
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
