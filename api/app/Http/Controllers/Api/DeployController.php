<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class DeployController extends Controller
{
    public function handle()
    {
        Log::info('GitHub webhook received.');

        exec('/var/www/erudits2/deploy.sh >> /var/log/deploy.log 2>&1 &');

        return response()->json(['message' => 'Deployment started']);
    }
}
