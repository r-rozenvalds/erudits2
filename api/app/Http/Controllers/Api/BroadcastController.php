<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\GameControlEvent;
use App\Events\PingEvent;
use App\Models\GameInstance;
use App\Models\Round;


class BroadcastController extends Controller
{
    public function ping(Request $request)
    {
        $pingTime = $request->input('ping_time');
        broadcast(new PingEvent($pingTime)); 

        return response()->json(['status' => 'Ping sent']);
    }

    public function gameControl(Request $request) {
        $command = $request->input('command');
        $instanceId = $request->input('instance_id'); 

        if($command == 'start') {
            $gameId = GameInstance::where('id', $instanceId)->value('game_id');
            $roundId = Round::where('game_id', $gameId)->where('order', 1)->value('id');

            GameInstance::where('id', $instanceId)->update(['current_round' => $roundId]);
        } else {
            GameInstance::where('id', $instanceId)->update(['end_date' => now()]);
        } 

        broadcast(new GameControlEvent($command, $instanceId));

        return response()->json(['status' => 'Command broadcasted']);
    }
}
