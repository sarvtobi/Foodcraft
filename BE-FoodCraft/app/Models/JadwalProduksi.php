<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JadwalProduksi extends Model
{
    use HasFactory;

    protected $table = 'jadwal_produksis';

    protected $fillable = [
        'umkm_id',
        'pesanan_id',
        'tanggal_produksi',
        'total_waktu_menit',
        'status',
        'terlambat',
    ];

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }

    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }
}
