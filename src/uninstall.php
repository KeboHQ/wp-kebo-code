<?php
/**
 * Kebo Code Uninstall File
 *
 * @package Kebo Code
 */

// Check for Un-Install constant.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit();
}

// Delete version Option.
delete_option( 'kebo_code_version' );
