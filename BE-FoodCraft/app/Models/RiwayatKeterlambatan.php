<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiwayatKeterlambatan extends Model
{
    use HasFactory;

    protected $table = 'riwayat_keterlambatans';

    protected $fillable = [
        'umkm_id',
        'pesanan_id',
        'tenggat_waktu',
        'diselesaikan_pada',
        'selisih_hari',
        'alasan_opsional',
    ];

    protected $casts = [
        'tenggat_waktu' => 'date',
        'diselesaikan_pada' => 'datetime',
    ];

    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }
}
