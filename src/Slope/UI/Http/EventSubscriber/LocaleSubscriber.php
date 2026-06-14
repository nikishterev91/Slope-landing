<?php

declare(strict_types=1);

namespace App\Slope\UI\Http\EventSubscriber;

use App\Slope\UI\Http\Exception\UnsupportedLocaleException;
use App\Slope\UI\Http\LocaleResolver;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final readonly class LocaleSubscriber implements EventSubscriberInterface
{
    /**
     * @param non-empty-list<non-empty-string> $supportedLocales
     * @param non-empty-string                 $defaultLocale
     */
    public function __construct(
        private LocaleResolver $localeResolver,
        #[Autowire('%app.supported_locales%')]
        private array $supportedLocales,
        #[Autowire('%app.default_locale%')]
        private string $defaultLocale,
    ) {
    }

    public function onKernelRequest(RequestEvent $event): void
    {

        $request = $event->getRequest();

        if ($request->attributes->has('_locale')) {
            return;
        }

        $pathInfo = $request->getPathInfo();
        foreach ($this->supportedLocales as $supportedLocale) {
            if (\str_starts_with($pathInfo, '/'.$supportedLocale.'/') || \str_starts_with($pathInfo, '/'.$supportedLocale)) {
                $request->setLocale($supportedLocale);

                return;
            }
        }

        try {
            $locale = $this->localeResolver->resolve($request);
            $request->setLocale($locale);
        } catch (UnsupportedLocaleException) {
            $request->setLocale($this->defaultLocale);
        }
    }

    /**
     * @return array<string, array<int, array{0: string, 1: int}>>
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['onKernelRequest', 20]],
        ];
    }
}
