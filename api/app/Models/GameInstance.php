<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class GameInstance extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'private',
        'code',
        'end_date',
        'game_id',
        'current_round',
    ];

    public function game() {
        return $this->belongsTo(Game::class);
    }

    public function players() {
        return $this->hasMany(Player::class);
    }
}
