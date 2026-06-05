<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $shouldSetAnalyser = false;

        if (!app()->runningInConsole()) {
            $shouldSetAnalyser = true;
        } else {
            $argv = $_SERVER['argv'] ?? [];
            foreach ($argv as $arg) {
                if (str_contains($arg, 'l5-swagger:generate') || str_contains($arg, 'test')) {
                    $shouldSetAnalyser = true;
                    break;
                }
            }
        }

        if ($shouldSetAnalyser) {
            config([
                'l5-swagger.defaults.scanOptions.analyser' => new \OpenApi\Analysers\ReflectionAnalyser([
                    new \OpenApi\Analysers\AttributeAnnotationFactory(),
                    new \OpenApi\Analysers\DocBlockAnnotationFactory(),
                ])
            ]);
        }
    }
}
