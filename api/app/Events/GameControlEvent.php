<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;

class GameControlEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $command;
    public $instanceId;  

    public function __construct($command, $instanceId)
    {
        $this->command = $command; // "start" or "stop" command
        $this->instanceId = $instanceId; // Game Instance ID
    }

    public function broadcastOn()
    {
        return new Channel('game-control-channel');
    }

    public function broadcastAs()
    {
        return 'game-control-event';
    }

    public function broadcastWith()
    {
        return [
            'command' => $this->command,
            'instanceId' => $this->instanceId,
        ];
    }
}
