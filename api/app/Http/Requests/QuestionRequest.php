<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'text',
            'points' => 'integer',
            'is_text_answer' => 'boolean',
            'guidelines' => 'text',
            'image_url' => 'text',
            'round_id' => 'required|exists:rounds,id'
        ];
    }
}
