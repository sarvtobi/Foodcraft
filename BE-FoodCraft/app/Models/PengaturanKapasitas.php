<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengaturanKapasitas extends Model
{
    use HasFactory;

    protected $table = 'pengaturan_kapasitas';

    protected $fillable = [
        'umkm_id',
        'kapasitas_harian_menit',
        'hari_operasi',
    ];

    protected $casts = [
        'hari_operasi' => 'array',
    ];

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }
}
