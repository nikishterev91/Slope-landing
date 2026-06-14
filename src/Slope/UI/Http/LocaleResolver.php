<?php

declare(strict_types=1);

namespace App\Slope\UI\Http;

use App\Slope\UI\Http\Exception\UnsupportedLocaleException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;

final readonly class LocaleResolver
{
    /**
     * @param non-empty-string                 $defaultLocale
     * @param non-empty-list<non-empty-string> $supportedLocales
     */
    public function __construct(
        #[Autowire('%app.default_locale%')]
        private string $defaultLocale,
        #[Autowire('%app.supported_locales%')]
        private array $supportedLocales,
    ) {
    }

    /**
     * @throws UnsupportedLocaleException
     */
    public function resolve(Request $request): string
    {
        $cookieLocale = $request->cookies->get('_locale');
        $headerLocale = $request->query->get('_locale');

        if (null === $headerLocale && null === $cookieLocale) {
            return $this->defaultLocale;
        }

        $locale = $headerLocale ?? $cookieLocale;

        // @phpstan-ignore function.alreadyNarrowedType
        if (!\is_string($locale) || !\in_array($locale, $this->supportedLocales, true)) {
            throw new UnsupportedLocaleException($cookieLocale, $headerLocale);
        }

        return $locale;
    }
}
