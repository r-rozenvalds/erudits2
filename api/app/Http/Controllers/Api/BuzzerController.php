<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Buzzer;
use Illuminate\Http\Request;
use App\Models\GameInstance;
use App\Events\GameControlEvent;
use App\Events\BuzzerEvent;
use Illuminate\Support\Str;
use App\Http\Requests\BuzzerRequest;
use Carbon;

class BuzzerController extends Controller
{

    public function initialize(Request $request) {
        $instance = GameInstance::find($request->instance_id);
        $instance->buzzers_mode = 1;
        $instance->save();
        broadcast(new GameControlEvent($instance->id, 'buzzers-start'));

        return response()->json(['message' => 'Buzzers initialized']);
    }

    public function deinitialize(Request $request) {
        $instance = GameInstance::find($request->instance_id);
        $instance->buzzers_mode = 0;
        $instance->save();
        broadcast(new GameControlEvent($instance->id, 'buzzers-stop'));

        return response()->json(['message' => 'Buzzers deinitialized']);
    }

    public function buzz(BuzzerRequest $request) {
        $allBuzzers = Buzzer::where('instance_id', $request['instance_id'])->get();

        if($allBuzzers->where('active', true)->count() > 0) {
            return response()->json(['message' => 'Another player has already buzzed']);
        }


        $buzzer = Buzzer::create([
            'id' => Str::uuid(),
            'instance_id' => $request['instance_id'],
            'player_id' => $request['player_id'],
            'buzzed_at' => Carbon\Carbon::parse($request['buzzed_at'])->format('Y-m-d H:i:s'),
        ]);



        $buzzer->active = true;
        $buzzer->save();

        $player = $buzzer->player;

        broadcast(new BuzzerEvent($buzzer->instance_id, $player->player_name, 'buzzed'));

        return response()->json(['message' => 'Buzzed']);
    }

    public function deactivateAll(Request $request) {
        $buzzers = Buzzer::where('instance_id', $request->instance_id)->get();

        foreach($buzzers as $buzzer) {
            $buzzer->active = false;
            $buzzer->save();
        }

        return response()->json(['message' => 'Buzzers deactivated']);
    }

    public function getInstanceBuzzers(Request $request) {
        $buzzers = Buzzer::where('instance_id', $request->instance_id)->get();

        return response()->json($buzzers);
    }

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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Buzzer $buzzer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Buzzer $buzzer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Buzzer $buzzer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Buzzer $buzzer)
    {
        //
    }
}
