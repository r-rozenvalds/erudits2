<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BuzzerEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */

     public $instanceId;
     public $playerName;

    public function __construct($instanceId, $playerName)
    {
        $this->instanceId = $instanceId;
        $this->playerName = $playerName;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [new Channel("buzzer.{$this->instanceId}")];
    }

    public function broadcastAs()
    {
        return 'buzzer-event';
    }

    public function broadcastWith()
    {
        return [
            'playerName' => $this->playerName,
        ];
    }
}
