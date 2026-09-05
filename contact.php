<?php

declare(strict_types=1);





















header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

$serverConfig = require __DIR__
    . DIRECTORY_SEPARATOR
    . 'config'
    . DIRECTORY_SEPARATOR
    . 'server-config.php';

if (!is_array($serverConfig)) {
    $serverConfig = [];
}









function is_ajax_request(): bool
{
    return isset($_SERVER['HTTP_X_REQUESTED_WITH'])
        && strtolower((string) $_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}





function json_response(
    bool $success,
    string $message,
    int $statusCode = 200,
    array $extra = []
): void {
    http_response_code($statusCode);

    header(
        'Content-Type: application/json; charset=UTF-8'
    );

    echo json_encode(
        array_merge(
            [
                'success' => $success,
                'message' => $message,
            ],
            $extra
        ),
        JSON_UNESCAPED_UNICODE
        | JSON_UNESCAPED_SLASHES
    );

    exit;
}





function html_response(
    bool $success,
    string $message,
    int $statusCode = 200
): void {
    http_response_code($statusCode);

    header(
        'Content-Type: text/html; charset=UTF-8'
    );

    $safeMessage = htmlspecialchars(
        $message,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    );

    $title = $success
        ? 'Message sent'
        : 'Unable to send message';

    $safeTitle = htmlspecialchars(
        $title,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    );

    echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="theme-color"
        content="#111111"
    >

    <title>{$safeTitle}</title>

    <style>
        * {
            box-sizing: border-box;
        }

        html,
        body {
            margin: 0;
            min-height: 100%;
            background: #111111;
            color: #ffffff;
            font-family:
                Arial,
                Helvetica,
                sans-serif;
        }

        body {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
        }

        .message {
            width: min(100%, 620px);
            padding: 38px;
            border: 1px solid rgba(255,255,255,.12);
            border-radius: 22px;
            background: #181818;
            text-align: center;
        }

        .message__mark {
            width: 54px;
            height: 54px;
            margin: 0 auto 22px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: #5C743B;
            font-size: 24px;
        }

        h1 {
            margin: 0;
            font-size: clamp(32px, 7vw, 52px);
            line-height: 1;
            letter-spacing: -.04em;
        }

        p {
            margin: 18px auto 0;
            max-width: 480px;
            color: #c6c5c1;
            line-height: 1.6;
        }

        a {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            min-height: 50px;
            margin-top: 28px;
            padding: 12px 24px;
            border-radius: 999px;
            background: #5C743B;
            color: #ffffff;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>

<body>

    <main class="message">

        <div class="message__mark">
            ✓
        </div>

        <h1>
            {$safeTitle}
        </h1>

        <p>
            {$safeMessage}
        </p>

        <a href="index.html#contact">
            Back to website
        </a>

    </main>

</body>
</html>
HTML;

    exit;
}





function respond(
    bool $success,
    string $message,
    int $statusCode = 200,
    array $extra = []
): void {
    if (is_ajax_request()) {
        json_response(
            $success,
            $message,
            $statusCode,
            $extra
        );
    }

    html_response(
        $success,
        $message,
        $statusCode
    );
}





function post_value(string $key): string
{
    if (!isset($_POST[$key])) {
        return '';
    }

    if (is_array($_POST[$key])) {
        return '';
    }

    return trim(
        (string) $_POST[$key]
    );
}







function strip_header_breaks(string $value): string
{
    return str_replace(
        ["\r", "\n", "%0a", "%0d"],
        '',
        $value
    );
}





function clean_line(
    string $value,
    int $maxLength = 180
): string {
    $value = strip_tags($value);

    $value = preg_replace(
        '/[\x00-\x1F\x7F]+/u',
        ' ',
        $value
    ) ?? $value;

    $value = preg_replace(
        '/\s+/u',
        ' ',
        $value
    ) ?? $value;

    $value = trim($value);

    return utf8_substr(
        $value,
        0,
        $maxLength
    );
}





function clean_message(
    string $value,
    int $maxLength = 5000
): string {
    $value = strip_tags($value);

    $value = str_replace(
        "\0",
        '',
        $value
    );

    $value = str_replace(
        ["\r\n", "\r"],
        "\n",
        $value
    );

    $value = preg_replace(
        "/\n{4,}/",
        "\n\n\n",
        $value
    ) ?? $value;

    $value = trim($value);

    return utf8_substr(
        $value,
        0,
        $maxLength
    );
}








function utf8_substr(
    string $value,
    int $start,
    int $length
): string {
    if (
        function_exists('mb_substr')
    ) {
        return mb_substr(
            $value,
            $start,
            $length,
            'UTF-8'
        );
    }

    if (
        preg_match_all(
            '/./us',
            $value,
            $matches
        )
    ) {
        return implode(
            '',
            array_slice(
                $matches[0],
                $start,
                $length
            )
        );
    }

    return substr(
        $value,
        $start,
        $length
    );
}





function encode_mail_subject(
    string $subject
): string {
    if (
        function_exists(
            'mb_encode_mimeheader'
        )
    ) {
        return mb_encode_mimeheader(
            $subject,
            'UTF-8',
            'B',
            "\r\n"
        );
    }

    return '=?UTF-8?B?'
        . base64_encode($subject)
        . '?=';
}





if (
    ($_SERVER['REQUEST_METHOD'] ?? '')
    !== 'POST'
) {
    respond(
        false,
        'Method not allowed.',
        405
    );
}






$contentLength =
    isset($_SERVER['CONTENT_LENGTH'])
        ? (int) $_SERVER['CONTENT_LENGTH']
        : 0;

if (
    $contentLength > 100000
) {
    respond(
        false,
        'The submitted request is too large.',
        413
    );
}






















$honeypot =
    post_value(
        'website_confirm'
    );

if ($honeypot !== '') {
    



    respond(
        true,
        'Thank you. Your request has been sent successfully.',
        200
    );
}












if (
    session_status()
    === PHP_SESSION_NONE
) {
    @session_start();
}

$now = time();

$lastSubmission =
    isset(
        $_SESSION[
            'averon_contact_last_submission'
        ]
    )
        ? (int) $_SESSION[
            'averon_contact_last_submission'
        ]
        : 0;

if (
    $lastSubmission > 0
    && ($now - $lastSubmission) < 3
) {
    respond(
        false,
        'Please wait a moment before sending another request.',
        429
    );
}






$name =
    clean_line(
        post_value('name'),
        120
    );

$company =
    clean_line(
        post_value('company'),
        160
    );

$email =
    clean_line(
        post_value('email'),
        254
    );

$website =
    clean_line(
        post_value('website'),
        500
    );

$businessType =
    clean_line(
        post_value('business_type'),
        120
    );

$budget =
    clean_line(
        post_value('budget'),
        120
    );

$service =
    clean_line(
        post_value('service'),
        160
    );

$message =
    clean_message(
        post_value('message'),
        5000
    );






$errors = [];






if ($name === '') {
    $errors['name'] =
        'Please enter your name.';
}

if (
    $name !== ''
    && strlen($name) < 2
) {
    $errors['name'] =
        'Please enter a valid name.';
}






if ($company === '') {
    $errors['company'] =
        'Please enter your company name.';
}






$email =
    strip_header_breaks(
        $email
    );

if ($email === '') {
    $errors['email'] =
        'Please enter your business email.';
} elseif (
    !filter_var(
        $email,
        FILTER_VALIDATE_EMAIL
    )
) {
    $errors['email'] =
        'Please enter a valid email address.';
}







if ($website !== '') {
    


    $websiteForValidation =
        $website;

    if (
        !preg_match(
            '~^https?://~i',
            $websiteForValidation
        )
    ) {
        $websiteForValidation =
            'https://'
            . $websiteForValidation;
    }

    if (
        !filter_var(
            $websiteForValidation,
            FILTER_VALIDATE_URL
        )
    ) {
        $errors['website'] =
            'Please enter a valid website address.';
    } else {
        $website =
            $websiteForValidation;
    }
}






$allowedBusinessTypes = [
    'Lead Generation',
    'E-commerce',
    'Local Business',
    'B2B / SaaS',
    'Mobile App',
    'Other',
];

if ($businessType === '') {
    $errors['business_type'] =
        'Please select a business type.';
} elseif (
    !in_array(
        $businessType,
        $allowedBusinessTypes,
        true
    )
) {
    $errors['business_type'] =
        'Please select a valid business type.';
}







$allowedBudgets = [
    '',
    'Under 5k',
    '5k - 15k',
    '15k – 50k',
    '15k - 50k',
    '50k+',
    'Prefer not to say',
];

if (
    !in_array(
        $budget,
        $allowedBudgets,
        true
    )
) {
    $errors['budget'] =
        'Please select a valid budget range.';
}






$allowedServices = [
    'Google Ads Management',
    'Performance Max',
    'Shopping',
    'Lead Generation',
    'Tracking & Analytics',
    'Marketing Automation',
    'Account Audit',
    'Other',
];

if ($service === '') {
    $errors['service'] =
        'Please select what you need help with.';
} elseif (
    !in_array(
        $service,
        $allowedServices,
        true
    )
) {
    $errors['service'] =
        'Please select a valid service.';
}






if ($message === '') {
    $errors['message'] =
        'Please tell us about your main goal.';
} elseif (
    strlen($message) < 10
) {
    $errors['message'] =
        'Please add a little more detail about your goal.';
}






if (!empty($errors)) {
    respond(
        false,
        'Please check the form and complete the required fields.',
        422,
        [
            'errors' => $errors,
        ]
    );
}






$recipient =
    trim(
        (string) (
            $serverConfig['email']
            ?? ''
        )
    );

if (
    !filter_var(
        $recipient,
        FILTER_VALIDATE_EMAIL
    )
) {
    error_log(
        '[Contact Form] Invalid or missing recipient email in server config.'
    );

    respond(
        false,
        'We could not send your request right now. Please try again or contact us by email.',
        500
    );
}

$fromEmail =
    trim(
        (string) (
            $serverConfig['fromEmail']
            ?? ''
        )
    );

if (
    !filter_var(
        $fromEmail,
        FILTER_VALIDATE_EMAIL
    )
) {
    error_log(
        '[Contact Form] Invalid or missing fromEmail in server config.'
    );

    respond(
        false,
        'We could not send your request right now. Please try again or contact us by email.',
        500
    );
}

$companyShortName =
    trim(
        (string) (
            $serverConfig['companyShortName']
            ?? 'Website'
        )
    );

if ($companyShortName === '') {
    $companyShortName = 'Website';
}

$subject =
    'New website enquiry — '
    . $service;






$submittedAt =
    date(
        'Y-m-d H:i:s'
    );

$ipAddress =
    $_SERVER['REMOTE_ADDR']
    ?? 'Unavailable';

$userAgent =
    $_SERVER['HTTP_USER_AGENT']
    ?? 'Unavailable';


$mailBody = implode(
    "\n",
    [
        'NEW WEBSITE ENQUIRY',
        '===================',
        '',
        'Name:',
        $name,
        '',
        'Company:',
        $company,
        '',
        'Business Email:',
        $email,
        '',
        'Website:',
        $website !== ''
            ? $website
            : 'Not provided',
        '',
        'Business Type:',
        $businessType,
        '',
        'Monthly Advertising Budget:',
        $budget !== ''
            ? $budget
            : 'Not provided',
        '',
        'Service / Help Required:',
        $service,
        '',
        'Main Goal / Message:',
        $message,
        '',
        '-------------------',
        '',
        'Submitted:',
        $submittedAt,
        '',
        'IP:',
        $ipAddress,
        '',
        'User Agent:',
        $userAgent,
        '',
    ]
);






$safeReplyTo =
    strip_header_breaks(
        $email
    );

$safeSender =
    strip_header_breaks(
        $fromEmail
    );


$headers = [
    'MIME-Version: 1.0',

    'Content-Type: text/plain; charset=UTF-8',

    'Content-Transfer-Encoding: 8bit',

    'From: '
        . strip_header_breaks(
            $companyShortName
        )
        . ' Website <'
        . $safeSender
        . '>',

    'Reply-To: '
        . $safeReplyTo,

    'X-Mailer: PHP/'
        . phpversion(),
];


$headerString =
    implode(
        "\r\n",
        $headers
    );






$sent = false;

try {
    $sent =
        @mail(
            $recipient,
            encode_mail_subject(
                $subject
            ),
            $mailBody,
            $headerString
        );
} catch (Throwable $exception) {
    $sent = false;
}






if (!$sent) {
    




    error_log(
        '['
        . strip_header_breaks(
            $companyShortName
        )
        . ' Contact Form] mail() failed. Recipient: '
        . $recipient
    );

    respond(
        false,
        'We could not send your request right now. Please try again or contact us by email.',
        500
    );
}






if (
    session_status()
    === PHP_SESSION_ACTIVE
) {
    $_SESSION[
        'averon_contact_last_submission'
    ] = $now;
}


respond(
    true,
    'Thank you. Your request has been sent successfully.',
    200
);
