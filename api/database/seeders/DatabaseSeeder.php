<?php

namespace Database\Seeders;

// Usage in DatabaseSeeder.php
use App\Models\Game;
use App\Models\Round;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run()
    {

        User::factory()->create();

        $game = Game::factory()->create([
            'id' => Str::uuid(),
        ]);

        $rounds = collect([
            ['is_additional' => false],
            ['is_additional' => false],
            ['is_additional' => false],
            ['is_additional' => true],
        ])->map(function ($data, $index) use ($game) {
            $round = Round::factory()->create(array_merge($data, [
                'id' => Str::uuid(),
                'game_id' => $game->id,
                'order' => $index + 1,
            ]));

            collect(range(1, 10))->each(function ($order) use ($round) {
                $question = Question::factory()->create([
                    'id' => Str::uuid(),
                    'round_id' => $round->id,
                    'is_text_answer' => $order <= 3,
                    'order' => $order,
                ]);

                collect(range(1, 4))->each(function ($answerIndex) use ($question) {
                    Answer::factory()->create([
                        'id' => Str::uuid(),
                        'question_id' => $question->id,
                        'is_correct' => $answerIndex === 1,
                    ]);
                });
            });

            return $round;
        });
    }
}
