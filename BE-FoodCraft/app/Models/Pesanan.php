<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Pesanan extends Model
{
    use HasFactory;

    protected $fillable = [
        'umkm_id',
        'pelanggan',
        'tenggat_waktu',
        'status',
        'prioritas',
        'total_harga',
    ];

    /**
     * Hitung prioritas berdasarkan tenggat_waktu.
     */
    public static function boot()
    {
        parent::boot();

        static::saving(function ($pesanan) {
            if ($pesanan->tenggat_waktu) {
                // Parsing tanggal deadline
                $deadline = Carbon::parse($pesanan->tenggat_waktu)->startOfDay();
                $today = Carbon::now()->startOfDay();

                // Hitung selisih hari
                $diffDays = $today->diffInDays($deadline, false); 
                // false supaya kalau deadline hari ini atau di masa lalu, hasilnya 0 atau negatif

                if ($diffDays <= 2) {
                    $pesanan->prioritas = 'tinggi'; // H, H+1, H+2 (Atau telat)
                } elseif ($diffDays <= 7) {
                    $pesanan->prioritas = 'sedang'; // <= Seminggu
                } else {
                    $pesanan->prioritas = 'rendah'; // > Seminggu
                }
            }
        });
    }

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PesananItem::class, 'pesanan_id');
    }
}
