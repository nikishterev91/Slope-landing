<?php

declare(strict_types=1);

namespace App\Slope\UI\Http\Exception;

use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class UnsupportedLocaleException extends BadRequestHttpException
{
    public function __construct(mixed $cookieLocale, mixed $requestLocale)
    {
        parent::__construct(
            sprintf(
                'Unsupported locale: Cookie: %s, Request: %s',
                $this->normalize($cookieLocale),
                $this->normalize($requestLocale)
            )
        );
    }

    private function normalize(mixed $value): string
    {
        return \is_string($value)
            ? $value
            : \get_debug_type($value);
    }
}
