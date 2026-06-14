<?php

declare(strict_types=1);

namespace App\Slope\UI\Http\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class LandingController extends AbstractController
{
    #[Route(
        path: '/{_locale}',
        name: 'homepage',
        requirements: ['_locale' => '%app.routing_supported_locales%'],
        methods: ['GET'],
        stateless: true
    )]
    public function __invoke(): Response
    {
        return $this->render('pages/home.html.twig');
    }
}
