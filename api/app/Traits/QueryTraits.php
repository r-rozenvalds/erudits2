<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

trait QueryTraits
{
    public function applyQueryParameters(
        Builder $query,
        Request $request,
        array $filterableFields = []
    ) {
        $data = $request->validated();

        if (!empty($data['filter']) && count($filterableFields)) {
            $query->where(function ($q) use ($data, $filterableFields) {
                foreach ($filterableFields as $field) {
                    $q->orWhere($field, 'like', '%' . $data['filter'] . '%');
                }
            });
        }
    
        foreach ($data as $key => $value) {
            if (!in_array($key, ['filter', 'sortBy', 'sortDesc', 'page', 'limit']) && !is_null($value)) {
                $query->where($key, $value);
            }
        }
    
        $sortBy = $data['sortBy'] ?? 'created_at';
        $sortDesc = $data['sortDesc'] ?? false;
    
        $query->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
    
        $perPage = $data['limit'] ?? 15;
        $page = $data['page'] ?? 1;
    
        return $query->paginate($perPage, ['*'], 'page', $page);
    }
}
