<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class JadwalProduksi extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'jadwal_produksis';

    protected $fillable = [
        'umkm_id',
        'pesanan_id',
        'tanggal_produksi',
        'total_waktu_menit',
        'status',
        'terlambat',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['pesanan_id', 'tanggal_produksi', 'total_waktu_menit', 'status', 'terlambat'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->setDescriptionForEvent(fn(string $eventName) => "Jadwal Produksi #{$this->id} telah di-{$eventName}")
            ->useLogName('jadwal_produksi');
    }

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }

    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }
}
