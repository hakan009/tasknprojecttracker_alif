<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user(); // user yang sedang login (dari Sanctum)

        // Total project aktif milik user ini
        $activeProjects = Project::where('user_id', $user->id)
            ->where('status', 'active')
            ->count();

        // Total task belum selesai (misal category bukan 'done')
        $pendingTasks = Task::where('user_id', $user->id)
            ->where('category', '!=', 'done') // sesuaikan dengan category seeder kamu
            ->count();

        // 5 task terdekat due date (belum selesai, urut ascending due_date)
        $upcomingTasks = Task::where('user_id', $user->id)
            ->where('category', '!=', 'done')
            ->whereNotNull('due_date')
            ->orderBy('due_date', 'asc')
            ->take(5)
            ->get(['id', 'title', 'due_date', 'category']);

        return response()->json([
            'active_projects' => $activeProjects,
            'pending_tasks'   => $pendingTasks,
            'upcoming_tasks'  => $upcomingTasks,
        ]);
    }
}
