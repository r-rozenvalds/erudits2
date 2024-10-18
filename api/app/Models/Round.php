<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Round extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'disqualify_amount',
        'answer_time',
        'points',
        'is_additional',
        'game_id',
    ];

    public function game(): BelongsTo {
        return $this->belongsTo(Game::class);
    }

    public function questions(): HasMany {
        return $this->hasMany(Question::class);
    }
}
