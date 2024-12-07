<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    use HasFactory, HasUuids;

    protected $fillable =[
        'id',
        'title',
        'points',
        'is_text_answer',
        'guidelines',
        'image_url',
        'round_id'
    ];

    public function question_group(): BelongsTo {
        return $this->belongsTo(QuestionGroup::class);
    }
}
