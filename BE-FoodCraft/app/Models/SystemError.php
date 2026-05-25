<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemError extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'system_errors';

    /**
     * Indicates if the model should be stamp-timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'ip_address',
        'method',
        'url',
        'exception_class',
        'message',
        'file',
        'line',
        'trace',
        'payload',
        'resolved',
        'created_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'trace' => 'array',
        'payload' => 'array',
        'resolved' => 'boolean',
        'created_at' => 'datetime',
    ];

    /**
     * Get the user experiencing the error.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
