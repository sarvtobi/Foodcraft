<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Produk extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'produks';

    protected $fillable = [
        'umkm_id',
        'nama',
        'deskripsi',
        'harga',
        'waktu_produksi',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nama', 'deskripsi', 'harga', 'waktu_produksi'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->setDescriptionForEvent(fn(string $eventName) => "Produk {$this->nama} telah di-{$eventName}")
            ->useLogName('produk');
    }

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }

    public function resep(): HasMany
    {
        return $this->hasMany(ResepProduk::class, 'produk_id');
    }
}
