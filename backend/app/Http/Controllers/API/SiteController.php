<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Sites;
use Validator;

//use App\Http\Controllers\API\APIBaseController;

class SiteController extends APIBaseController
{
    public function index() {
        $sites = Sites::all();

        return $this->sendResponse($sites->toArray(), 'Sites retrieved successfully.');
    }

    public function store(Request $request)
    {//echo 'store';die;
        $input = $request->all();
        $validator = Validator::make($input, [
            'link' => 'string',
            'email' => 'string',
            'period' => 'integer',
            'date_last_check' => 'string',
            'status' => 'string',
            'user_id' => 'integer'
        ]);
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());
        }
        $client = Sites::create($input);
        return $this->sendResponse($client->toArray(), 'Sites retrieved successfully.');
    }

    public function show($id)
    {
        $client = Sites::find($id);
        return $this->sendResponse($client->toArray(), 'Site retrieved successfully.');
    }

    public function update($id,Request $request)
    {
        $input = $request->all()[0];
        $validator = Validator::make($input, [
            'link' => 'string',
            'email' => 'string',
            'period' => 'integer',
            'date_last_check' => 'string',
            'status' => 'string',
            'user_id' => 'integer'
        ]);
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());
        }
        $client = Client::find($id);
        $client->link = $input['link'];
        $client->email = $input['email'];
        $client->period = $input['period'];
        $client->date_last_check = $input['date_last_check'];
        $client->status = $input['status'];
        $client->user_id = $input['user_id'];

        $client->save();
        return $this->sendResponse($client->toArray(), 'Post updated successfully.');
    }

    public function destroy($id)
    {
        $site = Sites::find($id);
        if (is_null($site)) {
            return $this->sendError('Site not found.');
        }
        $site->delete();
        return $this->sendResponse($id, 'Tag deleted successfully.');
    }
}
