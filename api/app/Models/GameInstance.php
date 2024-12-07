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
        'is_public',
        'is_active',
        'game_id',
    ];

    public function game() {
        return $this->belongsTo(Game::class);
    }
}
