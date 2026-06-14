<?php

declare(strict_types=1);

namespace App\Slope\UI\Http\Controller;

use App\Slope\UI\Http\Exception\UnsupportedLocaleException;
use App\Slope\UI\Http\LocaleResolver;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class RootRedirectController extends AbstractController
{
    public function __construct(
        #[Autowire('%app.default_locale%')]
        private readonly string $defaultLocale,
        private readonly LocaleResolver $localeResolver,
        private readonly LoggerInterface $logger,
    ) {
    }

    #[Route('/', name: 'root', methods: ['GET'], stateless: false)]
    public function __invoke(Request $request): Response
    {
        try {
            $locale = $this->localeResolver->resolve($request);
        } catch (UnsupportedLocaleException $exception) {
            $locale = $this->defaultLocale;

            $this->logger->error($exception->getMessage(), ['exception' => $exception]);
        }

        return $this->redirectToRoute('homepage', ['_locale' => $locale]);
    }
}
