<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::with('property');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('property_id')) {
            $query->where('property_id', $request->property_id);
        }

        $rooms = $query->orderBy('room_number')->paginate(15);
        $properties = Property::where('status', 'active')->get();

        return view('admin.rooms.index', compact('rooms', 'properties'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'room_number' => 'required|string|max:50',
            'floor' => 'required|string|max:20',
            'type' => 'required|string|in:single,double,dorm,suite,deluxe',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => 'required|numeric|min:0',
            'price_per_month' => 'nullable|numeric|min:0',
            'status' => 'required|string|in:available,occupied,maintenance,reserved',
            'description' => 'nullable|string',
            'amenities' => 'nullable|array',
        ]);

        Room::create($validated);

        return redirect()->route('admin.rooms.index')->with('success', 'Room created successfully!');
    }

    public function updateStatus(Request $request, Room $room)
    {
        $request->validate([
            'status' => 'required|string|in:available,occupied,maintenance,reserved',
        ]);

        $room->update(['status' => $request->status]);

        return back()->with('success', "Room {$room->room_number} status updated to {$request->status}!");
    }

    public function destroy(Room $room)
    {
        $room->delete();
        return redirect()->route('admin.rooms.index')->with('success', 'Room deleted successfully!');
    }
}
