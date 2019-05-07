<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
/**
 * @SWG\Swagger(
 *     basePath="/api",
 *     schemes={"http", "https"},
 *     host="www.site-monitoring.ua/blog/public/",
 *     @SWG\Info(
 *         version="1.0.0",
 *         title="L5 Swagger API",
 *         description="L5 Swagger API description",
 *         @SWG\Contact(
 *             email="darius@matulionis.lt"
 *         ),
 *     )
 * )
 *
 * @SWG\SecurityScheme(
 *     securityDefinition="Bearer",
 *     type="apiKey",
 *     in="header",
 *     name="Authorization"
 * )
 *
 * @SWG\Post(
 *   path="/auth",
 *   tags={"Authorization"},
 *   summary="Sample",
 *    @SWG\Parameter(
 *          name="body",
 *  description="sign in",schema="",
 *          in="body",default={{"email":"taras2andry@mail.ru","password":"1234sstr"}}
 *      ),
 *   @SWG\Response(response=200, description="successful operation")
 * )
 *)
 *
 *
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
