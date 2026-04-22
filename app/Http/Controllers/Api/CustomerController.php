<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    //
    public function index() {
        return response()->json(Customer::latest()->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string',
            'last_name' => 'required|string',
            'nick_name' => 'nullable|string',
            'hotel' => 'required|string',
            'room_number' => 'required|string',
        ]);

        return Customer::create($data);
    }

    public function update(Request $request, Customer $customer) {
        $customer->update($request->all());
        return $customer;
    }

    public function destroy(Customer $customer) {
        $customer->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
