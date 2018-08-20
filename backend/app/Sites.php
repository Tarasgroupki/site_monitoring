<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sites extends Model
{
    protected $fillable = [
        'link',
        'email',
        'period',
        'user_id',
        'date_last_check',
        'status',
        'create_at',
        'updated_at'
    ];
    protected $table = 'sites';
}
