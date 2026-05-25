<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class BahanBaku extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'bahan_bakus';

    protected $fillable = [
        'umkm_id',
        'nama',
        'satuan',
        'stok',
        'stok_dialokasikan',
        'stok_minimum',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nama', 'satuan', 'stok', 'stok_dialokasikan', 'stok_minimum'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->setDescriptionForEvent(fn(string $eventName) => "Bahan Baku {$this->nama} telah di-{$eventName}")
            ->useLogName('bahan_baku');
    }

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }
}
