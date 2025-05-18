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

        $signature = 'sha256=' . hash_hmac('sha256', $request->getContent(), env('GITHUB_WEBHOOK_SECRET'));
        if (!hash_equals($signature, $request->header('X-Hub-Signature-256'))) {
            Log::info('Unauthorized webhook attempt');
            abort(403, 'Unauthorized');
         }

        exec('/var/www/erudits2/deploy.sh >> /var/log/deploy.log 2>&1 &');

        return response()->json(['message' => 'Deployment started']);
    }
}
