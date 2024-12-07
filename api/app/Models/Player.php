<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Player extends Model
{
    use HasFactory, HasUuids;

    protected $fillable =[
        'id',
        'name',
        'points',
        'is_disqualified'
    ];

    public function game_instance()
    {
        return $this->belongsTo(GameInstance::class);
    }
}
