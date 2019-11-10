<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Sites;
use Validator;

//use App\Http\Controllers\API\APIBaseController;

/**
 * Class LeadsController
 * @package App\Http\Controllers\API
 *
 *
 *
 *  * @SWG\Get(
 *      path="/site",
 *      tags={"Sites"},
 *      summary="Get list of sites",
 *      description="Returns list of sites",
 *      @SWG\Response(
 *          response=200,
 *          description="successful operation"
 *       ),
 *       @SWG\Response(response=400, description="Bad request"),
 *       security={
 *           {
 *              "Bearer":{}
 *          }
 *       }
 *     )
 *
 * Returns list of index
 *
 *  * @SWG\Get(
 *      path="/site/{id}",
 *      operationId="getSiteById",
 *      tags={"Sites"},
 *      summary="Get sites information",
 *      description="Returns sites data",
 *      @SWG\Parameter(
 *          name="id",
 *          description="Site id",
 *          required=true,
 *          type="integer",
 *          in="path"
 *      ),
 *      @SWG\Response(
 *          response=200,
 *          description="successful operation"
 *       ),
 *      @SWG\Response(response=400, description="Bad request"),
 *      @SWG\Response(response=404, description="Resource Not Found"),
 *      security={
 *         {
 *              "Bearer":{}
 *          }
 *     },
 * )
 *
 * * @SWG\Post(
 *   path="/site",
 *   tags={"Sites"},
 *   summary="Create new site",
 *    @SWG\Parameter(
 *          name="site",
 *  description="Site object that needs to be added to the store",@SWG\Schema(
 *     @SWG\Property(property="id", type="integer"),
 *     @SWG\Property(property="link", type="string"),
 *     @SWG\Property(property="email", type="string"),
 *     @SWG\Property(property="period", type="integer"),
 *     @SWG\Property(property="date_last_check", type="string"),
 *     @SWG\Property(property="status", type="string"),
 *     ),
 *          in="body"
 *      ),
 *   @SWG\Response(response=200, description="successful operation"),
 *       security={
 *          {
 *              "Bearer":{}
 *          }
 *       }
 * )
 *)
 *
 *  *@SWG\Put(
 *   path="/site/{id}",
 *   tags={"Sites"},
 *   summary="Update new site",
 *    @SWG\Parameter(
 *          name="site",
 *  description="Site object that needs to be added to the store",@SWG\Schema(
 *     @SWG\Property(property="id", type="integer"),
 *     @SWG\Property(property="link", type="string"),
 *     @SWG\Property(property="email", type="string"),
 *     @SWG\Property(property="period", type="integer"),
 *     @SWG\Property(property="date_last_check", type="string"),
 *     @SWG\Property(property="status", type="string"),
 *     ),
 *          in="body",
 *      ),
 *   @SWG\Response(response=200, description="successful operation"),
 *       security={
 *           {
 *              "Bearer":{}
 *          }
 *       }
 * )
 *)
 *
 * *   @SWG\Delete(
 *      path="/api/site/{id}",
 *      tags={"Sites"},
 *      operationId="ApiV1DeleteSite",
 *      summary="Delete Site",
 *      @SWG\Parameter(
 *          name="id",
 *          description="Delete Site",
 *          in="path",
 *          required=true,
 *          type="string"
 *      ),
 *      @SWG\Response(
 *          response=200,
 *          description="Success"
 *      ),
 *     )
 *
 * * @SWG\Post(
 *   path="/fileUpload",
 *   tags={"Users"},
 *   summary="Upload Image",
 *    @SWG\Parameter(
 *          name="file",
 *  description="Uploading image",@SWG\Schema(),
 *          in="body"
 *      ),
 *     @SWG\Parameter(
name="additionalMetadata",
 *     description="Additional data to pass to server",@SWG\Schema(),
 *     in="body"
 *     ),
 *   @SWG\Response(response=200, description="successful operation")
 * )
 *)
 *
 * * @SWG\Definition(
 *     definition="Sites",
 *     type="object",
 *     description="Sites",
 *     properties={
 *     @SWG\Property(property="id", type="integer",format="int64"),
 *     @SWG\Property(property="link", type="string"),
 *     @SWG\Property(property="email", type="string"),
 *     @SWG\Property(property="period", type="integer",format="int64"),
 *     @SWG\Property(property="date_last_check", type="string"),
 *     @SWG\Property(property="status", type="string",enum={"Виконано", "Виконується", "Не виконується"}),
 *     }
 * )
 */

class SiteController extends APIBaseController
{
    public function index() {
        $sites = Sites::all()->toArray();

        foreach ($sites as $key => $site) {
            if($site['status'] == 0) {
                $sites[$key]['status'] = 'Not Working';
            }
            else {
                $sites[$key]['status'] = 'Working';
            }
        }

        return $this->sendResponse($sites, 'Sites retrieved successfully.');
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
            //'user_id' => 'integer'
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
        $client = Sites::find($id);
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
