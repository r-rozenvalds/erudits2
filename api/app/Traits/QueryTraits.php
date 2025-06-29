<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

trait QueryTraits
{
    public function applyQueryParameters(
    Builder $query,
    Request $request,
    array $filterableFields = [],
    array $controlKeys = []
    ) {
        $data = $request->validated();

        // Merge default controls like pagination & sorting
        $controlKeys = array_merge($controlKeys, ['filter', 'sortBy', 'sortDesc', 'page', 'limit']);

        // 1. Global text filter
        if (!empty($data['filter']) && count($filterableFields)) {
            $query->where(function ($q) use ($data, $filterableFields) {
                foreach ($filterableFields as $field) {
                    $q->orWhere($field, 'like', '%' . $data['filter'] . '%');
                }
            });
        }

        // 2. Apply exact filters
        foreach ($data as $key => $value) {
            if (!in_array($key, $controlKeys) && !is_null($value)) {
                $query->where($key, $value);
            }
        }

        // 3. Sort
        $sortBy = $data['sortBy'] ?? 'created_at';
        $sortDesc = $data['sortDesc'] ?? false;
        $query->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');

        // 4. Paginate
        $perPage = $data['limit'] ?? 15;
        $page = $data['page'] ?? 1;

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

}
