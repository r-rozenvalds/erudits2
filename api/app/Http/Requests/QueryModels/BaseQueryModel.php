<?php

namespace App\Http\Requests\QueryModels;

use Illuminate\Foundation\Http\FormRequest;

class BaseQueryModel extends FormRequest
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
        return [
            'filter' => 'nullable|string',
            'sortBy' => 'nullable|string',
            'sortDesc' => 'nullable|boolean',
            'page' => 'integer|min:1',
            'limit' => 'nullable|integer|min:1',
        ];
    }
}
