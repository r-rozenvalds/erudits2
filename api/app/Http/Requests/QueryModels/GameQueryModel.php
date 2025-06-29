<?php

namespace App\Http\Requests\QueryModels;

use Illuminate\Foundation\Http\FormRequest;

class GameQueryModel extends BaseQueryModel
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'id' => 'nullable|string',
            'user_id' => 'nullable|string',
            'add_rounds' => 'nullable|boolean',
            'add_questions' => 'nullable|boolean',
            'add_answers' => 'nullable|boolean',
        ]);
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'sortDesc' => filter_var($this->sortDesc, FILTER_VALIDATE_BOOLEAN),
            'add_rounds' => filter_var($this->add_rounds, FILTER_VALIDATE_BOOLEAN),
            'add_questions' => filter_var($this->add_questions, FILTER_VALIDATE_BOOLEAN),
            'add_answers' => filter_var($this->add_answers, FILTER_VALIDATE_BOOLEAN),
        ]);
    }

}
