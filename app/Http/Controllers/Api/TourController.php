<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tour;

class TourController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        // return response()->json(Tour::all(), 200);
        return response()->json(Tour::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required',
            'price' => 'required|numeric',
            'image' => 'nullable|string'
        ]);

        $tour = Tour::create($validated);
        return response()->json($tour, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $tour = [
            "message" => "no data yet!"
        ];
        return response()->json($tour, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
