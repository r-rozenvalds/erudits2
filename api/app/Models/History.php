<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class History extends Model
{
    use HasFactory, HasUuids;

    protected $fillable =[
        'id',
        'player_id',
        'question_id',
        'instance_id',
        'answer_id',
        'round_id',
        'action'
    ];

}
