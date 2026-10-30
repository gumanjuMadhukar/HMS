<?php

namespace Modules\Owner\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OwnerPropertyController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $properties = $user->hasRole('super_admin')
            ? Property::withCount('rooms')->latest()->paginate(10)
            : Property::where('owner_id', $user->id)->withCount('rooms')->latest()->paginate(10);

        return view('owner.properties.index', compact('properties'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:hostel,hotel,apartment,coliving',
            'city' => 'required|string|max:100',
            'address' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'description' => 'nullable|string',
            'amenities' => 'nullable|array',
        ]);

        $validated['owner_id'] = $request->user()->id;
        $validated['slug'] = Str::slug($validated['name']) . '-' . rand(100, 999);
        $validated['status'] = 'active';

        $property = Property::create($validated);

        return redirect()->route('owner.properties.index')->with('success', "Property '{$property->name}' created successfully!");
    }
}

