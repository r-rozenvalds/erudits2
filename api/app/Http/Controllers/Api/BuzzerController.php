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
use App\Models\Player;

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
        $instance = GameInstance::find($request['instance_id']);
        if($instance->buzzers_mode == 0) {
            return response()->json(['message' => 'Buzzers are not initialized']);
        }


        foreach ($allBuzzers as $existingBuzzer) {
            if ($existingBuzzer->active && $existingBuzzer->buzzed_at <= Carbon\Carbon::parse($request['buzzed_at'])->format('Y-m-d H:i:s')) {
                return response()->json(['message' => 'Another buzzer is already active with an earlier or same buzzed_at timestamp']);
            }
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

        $instance->buzzers_enabled = 0;
        $instance->save();
        broadcast(new GameControlEvent($instance->id, 'buzzers-disabled'));

        broadcast(new BuzzerEvent($buzzer->instance_id, $player->player_name, 'buzzed'));

        return response()->json(['message' => 'Buzzed']);
    }

    public function deactivateAll(Request $request) {
        $buzzers = Buzzer::where('instance_id', $request->instance_id)->get();
        $instance = GameInstance::find($request->instance_id);
        if($instance->buzzers_mode == 0) {
            return response()->json(['message' => 'Buzzers are not initialized']);
        }
        foreach($buzzers as $buzzer) {
            $buzzer->active = false;
            $buzzer->save();
        }

        $instance->buzzers_enabled = 1;
        $instance->save();
        broadcast(new GameControlEvent($instance->id, 'buzzers-enabled'));

        return response()->json(['message' => 'Buzzers deactivated']);
    }

    public function getInstanceBuzzers(Request $request) {
        $buzzers = Buzzer::where('instance_id', $request->instance_id)->get();
        $instance = GameInstance::find($request->instance_id);
        $activeBuzzer = $buzzers->where('active', true)->first();
        $buzzed_player = $activeBuzzer ? Player::findOrFail($activeBuzzer->player_id) : null;

        return response()->json(['buzzers' => $buzzers, 'instance' => $instance, 'buzzed_player' => $buzzed_player], 200);
    }

    public function toggleBuzzers(Request $request) {
        $instance = GameInstance::find($request->instance_id);
        if($instance->buzzers_mode == 0) {
            return response()->json(['message' => 'Buzzers are not initialized']);
        }
        $instance->buzzers_enabled = !$instance->buzzers_enabled;
        $instance->save();

        if($instance->buzzers_enabled) {
            broadcast(new GameControlEvent($instance->id, 'buzzers-enabled'));
        } else {
            broadcast(new GameControlEvent($instance->id, 'buzzers-disabled'));
        }

        return response()->json(['message' => 'Buzzers toggled']);
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
